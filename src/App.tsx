import './App.scss'

import { useState } from 'react'

import Select, { type SelectItem } from './components/Select'

function App() {
    const [selectedItems, setSelectedItems] = useState<SelectItem[]>([])
    const [items, setItems] = useState([
        { value: 'education', label: 'Education 🎓' },
        { value: 'science', label: 'Yeeeah, science! ⚗️' },
        { value: 'art', label: 'Art 🎭' },
        { value: 'sport', label: 'Sport ⚽️' },
        { value: 'games', label: 'Games 🎮' },
        { value: 'health', label: 'Health 🏥' },
    ])

    return (
        <main className="app">
            <h1>Lobox Assignment</h1>
            <Select
                items={items}
                selectedItems={selectedItems}
                onChange={(selectedItems) => setSelectedItems(selectedItems)}
                onTag={(tag) => {
                    const item = {
                        value: tag + Math.floor(Math.random() * 10000000),
                        label: tag,
                    }
                    setItems([...items, item])
                    setSelectedItems([...selectedItems, item])
                }}
                placeholder="Pick some"
            />
        </main>
    )
}

export default App
