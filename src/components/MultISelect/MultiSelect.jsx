import { useEffect, useMemo, useRef, useState } from 'react';

/**
 *  There's a built-in function which isn't widely supported yet so this one is sourced from StackOverflow:
 *  https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 */
function escapeRegExp(string) {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
}

/**
 * Basic Debounce function, would normally use lodash or similar.
 * @param func function to be called
 * @param delay delay (ms)
 * @returns {(function(...[*]): void)|*}
 */
function debounce(func, delay = 200) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => { func.apply(this, args); }, delay);
    };
}


//todo
// need to fix the multi selector, when you try to select from a filter position, it wipes the previous selections,
// general cleanup? the function itself looks messy
// add a new className property, should {component: 'className' } to allow customization.
// display options could probably be a map, then i can use it with sets to do a union and distinct for the multi selector


/**
 * @summary This is a React functional component that acts as a single or multi select box.
 * @param {boolean} required Uncontrolled validation
 * @param {string} name Allows this component to be used in a form.
 * @param {boolean} isMulti Single selected option or multiple selected options support (true/false)
 * @param {Array<Object<key:any, label:any>>} defaultValue for uncontrolled component, sets a default value
 * @param {Array<Object<key:any, label:any>>} options
 * @param {Array<Object<key:any, label:any>>} controlledValue controlled component; contains the selection object
 * @param {boolean} isValid bool check to add a Valid class to the root. (optional)
 * @param {boolean} isInvalid  bool check to add an InValid class to the root.
 * @param onChange controlled component; function called when updates to controlledValue is expected
 * @param {string }placeholder placeholder text
 * @returns {JSX.Element}
 * @constructor
 */

function MultiSelect({required=false ,name, isMulti = false, defaultValue, options = [], value: controlledValue, isValid = false, isInvalid = false, onChange: propagateOnChange = () => 0, placeholder = `Select...` }) {
    const isControlled = typeof controlledValue !== 'undefined';

    if(isControlled && defaultValue){
        throw new Error('Error, cannot set defaultValue in a controlled component ')
    }

       const [internalSelection, setInternalSelection] = useState([]),
        [searchText, setSearchText] = useState(''),
        selection = controlledValue ? controlledValue || [] : internalSelection,
        [dropDownOpen, setDropdownOpen] = useState(false),
        dropdownMenuRef = useRef(null),

        // create an object that determines the true distinct number of options
        uniqueOptions = useMemo(() => {
            if(options) {
                return new Set(options.map((s) => JSON.stringify(s, Object.keys(s).sort())));
            }
            return 0;
        }, [options]),

        // create a set that contains all currently selected items, adds to the memory/render burden but means O(1) lookup for checkboxes.
        internalSelectionLookup = new Set(selection.map((s) => JSON.stringify(s, Object.keys(s).sort()))),


        /**
         *  Bonus Feature: Filter out options we want to show the users, in multi, we use the filter, in single
         *  we exclude the current selection
         * @type {Array<Object<key: any, label: any>>}
         */
        displayOptions = useMemo(() => {
            if(options) {
                if(isMulti && searchText.length > 0) {
                    // if we're in multiSelect, we want to filter out any matching options based on our search box.
                    return options.filter((option) => option.label.match(escapeRegExp(searchText)));
                } else if(!isMulti && selection.length > 0) {
                    // otherwise, if we're in single mode, we want to filter out any matching based on our selection.
                    return options.filter((option) => option.value !== selection[0].value);
                }
                return options;
            }
            return [];
        }, [isMulti ? searchText : selection, options]),


        optimizedFilterChange = debounce((newValue) => setSearchText(newValue), 200),

        setAll = () => {
            /*
                Im a moron, the selection cant have duplicates.

             */
            // we want to add all that are visible, in addition to what's already selected

            const tempMap = new Map(displayOptions.map((s) => [s.value, s.label])),
                newOptions = Array.from(tempMap, ([value, label]) => ({ value, label }));
            isControlled ? propagateOnChange(newOptions) : setInternalSelection(newOptions);
        },

        unsetAll = () => {
            // we want to remove only what's visible and selected.
            isControlled ? propagateOnChange([]) : setInternalSelection([]);
        },

        unsetSelection = (newSelectionItem) => {
            isControlled ? propagateOnChange(controlledValue.filter((previous) => previous.value !== newSelectionItem.value)) : setInternalSelection((prevState) => prevState.filter((previous) => previous.value !== newSelectionItem.value));
        },

        setSelection = (newSelectionItem) => {
            if(isControlled) {
                if(isMulti) {
                    propagateOnChange([...(controlledValue || []), newSelectionItem]);
                } else {
                    propagateOnChange([newSelectionItem]);
                    setDropdownOpen(false);
                }
            } else {
                if(isMulti) {
                    setInternalSelection((prevState) => [...prevState, newSelectionItem]);
                } else {
                    setInternalSelection([newSelectionItem]);
                    setDropdownOpen(false);
                }
            }
        };

    /**
     * Bonus Feature, when we update the options fed into this component, we should dynamically update our selection to
     * remove any options no longer present
     */
    useEffect(() => {
        if(options === null || selection.length === 0) {
            return;
        }

        if(options.length === 0) {
            isControlled ? propagateOnChange([]) : setInternalSelection([]);
        }

        // if the options change, we want to go through the selections and drop any that are no longer present
        const newSelection = selection.reduce((result, s) => {
            if(uniqueOptions.has(JSON.stringify(s, Object.keys(s).sort()))) {
                result.push(s);
            }
            return result;
        }, []);
        isControlled ? propagateOnChange(newSelection) : setInternalSelection(newSelection);

        // we're only checking when our options change,
    }, [uniqueOptions]);


    /**
     * A user should be able to open and close the dropdown menu. This sets and cleans up an event listener to detect
     * clicks outside the menu
     */
    useEffect(() => {
        // resetSearchText
        setSearchText('');

        const close = (e) => {
            if(!dropdownMenuRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        if(dropDownOpen) {
            window.addEventListener('click', close);
        }
        return function removeListener() {
            window.removeEventListener('click', close);
        };
    }, [dropDownOpen]); // only run if open state changes

    return (<div ref={dropdownMenuRef} className="multiselect-container">
            <div className={`multiselect-button ${isValid ? 'valid' : ''} ${isInvalid ? 'invalid' : ''} ${(required ? (selection.length <= 0 ? 'invalid' : 'valid') : '')}`} onClick={() => setDropdownOpen((prevState) => !prevState)}>
                <div className={`multiselect-button-title ${selection.length === 0 ? 'placeholder' : ''}`}>{selection.length > 0 ? selection.map(s => s.label).join(', ') : placeholder}</div>
                <svg style={{ rotate: dropDownOpen ? '0deg' : '180deg' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={15} height={15} strokeWidth={3} stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 15L12 9L18 15" />
                </svg>

            </div>
            {dropDownOpen && (
                <ul className="multiselect-dropdown-menu">
                    {
                        isMulti && <li className="multiselect-dropdown-controls" key={'multiselect-dropdown-controls'}>
                            <input checked={internalSelectionLookup.size === uniqueOptions.size} title="Select/Deselect All" type="checkbox" onChange={(e) => {
                                (e.currentTarget.checked ? setAll() : unsetAll());
                            } } ref={input => {
                                if(internalSelectionLookup.size < uniqueOptions.size && internalSelectionLookup.size > 0 && input) {
                                    input.indeterminate = true;
                                } if(internalSelectionLookup.size === 0 && input) {
                                    input.indeterminate = false;
                                }
                            }} /><input id={'multiselect-dropdown-filter-control'} placeholder={'Filter Options...'} onChange={(e) => optimizedFilterChange(e.currentTarget.value)} type={'search'}/>
                        </li>

                    }
                    {
                        displayOptions.map((item, index) => {
                        const selected = internalSelectionLookup.has(JSON.stringify(item, Object.keys(item).sort()));
                        return <li key={`multiselect-dropdown-item-${index}`} >
                            {
                                isMulti ? <label className={`multiselect-dropdown-option ${selected ? 'selected' : ''} `} ><input type="checkbox" onChange={(e) => e.currentTarget.checked ? setSelection(item) : unsetSelection(item) } checked={selected} />{item.label}</label> : <label className="multiselect-dropdown-option" onClick={() => setSelection(item)}> {item.label}</label>
                            }
                        </li>;
                    })}
                    {displayOptions.length === 0 && <li>
                        <label className="multi-select-dropdown-empty" style={{}}>No Results</label>
                    </li>}

                </ul>
            )}
            <input type="hidden" name={name} value={JSON.stringify(isControlled ? controlledValue || [] : internalSelection)} />
        </div>);
}

export { MultiSelect };