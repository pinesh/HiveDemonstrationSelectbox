
import {MultiSelect} from "./components/MultISelect/MultiSelect";
import './resources/MultiSelectStyles.css'
import {useState} from "react";

const oss = [{label: '1 long text', value: '1'},
  {label: '2 long text', value: '2'},
  {label: '3 long text', value: '3'},
  {label: '4 long text', value: '4'},
  {label: '5 long text', value: '5'},
  {label: '2 long text', value: '2'},
  {label: '3 long text', value: '3'},
  {label: '4 long text', value: '4'},
  {label: '5 long text', value: '5'},
    {label: '2 long text', value: '2'},
    {label: '3 long text', value: '3'},
    {label: '4 long text', value: '4'},
    {label: '5 long text', value: '5'},
    {label: '2 long text', value: '2'},
    {label: '3 long text', value: '3'},
    {label: '4 long text', value: '4'},]


function App() {

  const [options, setOptions] = useState(oss)
    const[controlledSelection, setControlledSelection] = useState(null)
    const[controlledMultiSelection, setControlledMultiSelection] = useState(null)




  return (
    <div className="App">

        <h3>
            Controlled
        </h3>

      <span> this is a controlled multiSelector <MultiSelect isMulti={true} placeholder={'select a control...'} value={controlledMultiSelection} onChange={setControlledMultiSelection} options={options}></MultiSelect></span>
        <span>this is a controlled singleSelector <MultiSelect placeholder={'select a control...'} options={options} value={controlledSelection} onChange={setControlledSelection}></MultiSelect> </span>
        <p>the controlled multi selection is {JSON.stringify(controlledMultiSelection)}</p>
        <p>the controlled selection is {JSON.stringify(controlledSelection)}</p>
      <button onClick={()=>{
        setControlledSelection([{label: '1 long text', value: '1'}])
      }}>force selection</button>
        <button onClick={()=>{
            setControlledMultiSelection(null)
            setControlledSelection(null)
        }}>clear selection</button>

        <h3>
            Un-Controlled
        </h3>
        <span> this is a multiSelector <MultiSelect isMulti={true} options={options}></MultiSelect></span>
        <span> this is a singleSelector <MultiSelect options={options}></MultiSelect></span>
        <br/>
        <h3>
            Uncontrolled Form
        </h3>

        <span> this is a demonstration of an uncontrolled component working like a native input in a form (see console) </span>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const selection = formData.get("selection")
                console.log('form submit returned', JSON.parse(selection))
            }}
        >
            <MultiSelect name={"selection"} required={true} options={options}></MultiSelect>

            <button>Submit</button>
        </form>
        <h3>
            extra
        </h3>
        <button onClick={()=>{
            setOptions([{label: '1 long text', value: '1'},
                {label: '2 long text', value: '2'},
                {label: '3 long text', value: '3'}])

        }}>this button will remove all options > 3 to demonstrate the select persistance</button>
    </div>
  );
}

export default App;
