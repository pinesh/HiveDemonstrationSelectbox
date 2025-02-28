
import {MultiSelect} from "./components/MultISelect/MultiSelect";
import './resources/MultiSelectStyles.css'
import {useState} from "react";

const oss = [{label: '1 long text', value: '1'},{label: '1 long text', value: '8'},{label: 1, value: 1},
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


const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
    "Ivy",
    "Jack",
    "Kara",
    "Liam",
    "Mona",
    "Nathan",
    "Olivia",
    "Paul",
    "Quinn",
    "Rachel",
    "Sam",
    "Tina",
    "Umar",
    "Vera",
    "Walter",
    "Xander",
    "Yasmine",
    "Zane",
    "Amber",
    "Bryce",
    "Cecilia",
    "Derek",
    "Eliana",
    "Felix",
    "Georgia",
    "Harvey",
    "Isla",
    "Jasper",
    "Kendall",
    "Luca",
    "Mira",
    "Noah",
    "Ophelia",
    "Parker",
    "Quincy",
    "Rosie",
    "Sebastian",
    "Tessa",
    "Ulysses",
    "Violet",
    "Wesley",
    "Xenia",
    "Yosef",
    "Zelda",
    "Aaron",
    "Beatrice",
    "Caleb",
    "Diana",
    "Elliot",
    "Frida",
    "Gavin",
    "Holly",
    "Ian",
    "Jocelyn",
    "Kai",
    "Leona",
    "Miles",
    "Nadia",
    "Oscar",
    "Phoebe",
    "Ronan",
    "Serena",
    "Tristan",
    "Uma",
    "Vincent",
    "Willow",
    "Xiomara",
    "Yvette",
    "Zachary",
    "Adele",
    "Bennett",
    "Cora",
    "Dorian",
    "Esther",
    "Finn",
    "Genevieve",
    "Hector",
    "Irene",
    "Jonah",
    "Kiera",
    "Logan",
    "Maddox",
    "Nina",
    "Orson",
    "Penelope",
    "Reuben",
    "Sylvia",
    "Theo",
    "Ursula",
    "Victor",
    "Winnie",
    "Xavier",
];

const largeDataSet = [
    { label: "Alice", value: 42 },
    { label: "Bob", value: -30 },
    { Label: "Charlie", value: 100 },
    { label: "Alice", value: 15 }, // Duplicate name
    { label: "Eve", value: -30 }, // Duplicate value
    { label: "", value: 20 }, // Empty name
    { label: "Frank", Value: 50 }, // Varied casing
    { label: "Grace", value: null }, // Null value
    { label: "Hank", value: undefined }, // Undefined value
    ...Array.from({ length: 991 }, (_, i) => ({
        label: names[Math.floor(Math.random() * names.length)],
        value:
            Math.random() < 0.05
                ? Math.random() < 0.5
                    ? null
                    : undefined
                : Math.floor(Math.random() * 201) - 100,
    })),
];


function App() {

  const [options, setOptions] = useState(oss)
    const[controlledSelection, setControlledSelection] = useState(null)
    const[controlledMultiSelection, setControlledMultiSelection] = useState(null)
    const[controlledLargeMultiSelection, setControlledLargeMultiSelection] = useState(null)



  return (
    <div className="App">
        <h2>
            Hive Technical Submission,   Author: Harry Pines

        </h2>
        <h3>
            Notes
        </h3>
        <span> this component was intended to work in situations where data validity can't be guaranteed. In situations where options might be dynamically loaded, strict uniqueness isn't promised. thus some optimizations that could've been used for increased performance aren't utilized.

        <br/><br/><b>option labels and values are expected to all be interpretable as a string. a more complex select system could use a more complex options object with a renderer function and filtervalue</b>
        </span>


        <h3>
            Controlled
        </h3>

      <span> this is a controlled multiSelector <MultiSelect multiple={true} placeholder={'select a control...'} value={controlledMultiSelection} onChange={setControlledMultiSelection} options={options}></MultiSelect></span>
        <span> this is a controlled multiSelector with a large number of options <MultiSelect multiple={true} placeholder={'select a control...'} value={controlledLargeMultiSelection} onChange={setControlledLargeMultiSelection} options={largeDataSet}></MultiSelect></span>

        <span>this is a controlled singleSelector <MultiSelect placeholder={'select a control...'} options={options} value={controlledSelection} onChange={setControlledSelection}></MultiSelect> </span>
        <p>the controlled multi selection is {JSON.stringify(controlledMultiSelection)}</p>
        <p>the controlled selection is {JSON.stringify(controlledSelection)}</p>
      <button onClick={()=>{
        setControlledSelection([{label: '1 long text', value: '1'}])
          setControlledMultiSelection([{label: '1 long text', value: '1'}])
      }}>force selection</button>
        <button onClick={()=>{
            setControlledMultiSelection(null)
            setControlledSelection(null)
        }}>clear selection</button>

        <h3>
            Un-Controlled
        </h3>
        <span> this is a multiSelector <MultiSelect multiple={true} options={options}></MultiSelect></span>
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
        <span>this button will remove all a range of options to all select boxes to demonstrate how selected options will persist if still valid <button onClick={()=>{
            setOptions([{label: '1 long text', value: '1'},
                {label: '2 long text', value: '2'},
                {label: '3 long text', value: '3'}])

        }}>Refresh page after click</button></span>

    </div>
  );
}

export default App;
