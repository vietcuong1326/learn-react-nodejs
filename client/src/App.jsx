import { useState , useEffect } from 'react'; // Khai báo Hook
import './App.css';              // Khai báo CSS

function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    useEffect (() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/persons');
                const data = await response.json();
                setPersons(data);
            }
            catch(err){
                console.error("Error: ", err);
            }
            }
        
        fetchData();
    }, []);

    const deletePerson = async(id, name) => {
        if (window.confirm('Are you sure you want to delete {name} ?')){
        try {
            const response = await fetch(`http://localhost:5000/api/persons/${id}`,
                {
                    'Content-Type' : 'application/json',
                    method : 'DELETE'
                }
            )

            if (response.ok){
                setPersons(persons.filter(person => person.id !== id));
            } 
            else {
                alert("This person was already removed from server");
            }
        }
        catch(err){
            console.error("loi khi xoa nguoi: ", err);
        }
    }
    }

    const addPerson = async (event) => {
        event.preventDefault();
        const newPerson = {
            name : newName,
            number : newNumber
        }

        try {
            const response = await fetch('http://localhost:5000/api/persons', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify(newPerson)
            });
            const savedPerson = await response.json();
            setPersons(persons.concat(savedPerson));
            setNewName('');
            setNewNumber('');
        }
        catch(err){
            console.error("Error: ", err);
        }
            
        
    };

    return (
        <div>
            <h1>PhoneBook</h1>
            <p>fill shown with <input type="text" placeholder="Enter info"></input></p>
            <h1>add a new</h1>
            <form onSubmit={addPerson}>
                <div>
                    name: <input type="text"  
                    value={newName} 
                    onChange={e=> setNewName(e.target.value)}
                    placeholder="Enter name"
                    />
                </div>
                <div>
                    number: <input type="text"
                    value={newNumber} 
                    onChange={e=> setNewNumber(e.target.value)}
                    placeholder="Enter number"
                    />
                </div>
                <button type="submit">add</button>
            </form>
        
            <h1>Numbers</h1>
            <ul>    
                {persons.map(person =>( 
                <li key = {person.id} > {person.name} - {person.number} <button onClick={() => deletePerson(person.id, person.name)}>delete</button></li>))}
            </ul>
        </div>
    )

}
export default App;