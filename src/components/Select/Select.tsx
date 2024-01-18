import './Select.scss'

import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'

import CheckIcon from '@/assets/icons/check.svg?react'
import ChevronDown from '@/assets/icons/chevron-down.svg?react'
import useClickOutside from '@/hooks/useClickOutside.ts'

export type SelectItem = {
    value: string
    label: string
}

export type SelectProps = {
    items: SelectItem[]
    selectedItems: SelectItem[]
    onChange: (selectedItems: SelectItem[]) => void
    onTag: (value: string) => void
    placeholder?: string
    className?: string
    maxHeight?: number
}

function Select({
    items,
    selectedItems,
    placeholder = '',
    maxHeight = 600,
    onChange,
    onTag,
    className,
}: SelectProps) {
    const selectRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useClickOutside(selectRef, () => {
        setIsOpen(false)
    })

    let displayedLabel = ''
    if (selectedItems.length) {
        displayedLabel = selectedItems
            .slice(0, 2)
            .map((item) => item.label)
            .join(' , ')
        if (selectedItems.length > 2) {
            displayedLabel += `  +${selectedItems.length - 2}`
        }
    }

    const trimmedSearchTerm = searchTerm.trim()
    const isSearchTermValid = trimmedSearchTerm.length > 0
    const searchTermIsUnique = !items.find((item) => item.label === trimmedSearchTerm)

    const filteredItems = isSearchTermValid
        ? items.filter((item) => {
              return item.label.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
          })
        : items

    const handleTag = (tag: string) => {
        onTag?.(tag)
        setSearchTerm('')
    }

    const handleItemClick = (item: SelectItem) => {
        const newValue = [...selectedItems]
        const index = newValue.indexOf(item)

        if (index !== -1) {
            newValue.splice(index, 1)
        } else {
            newValue.push(item)
        }

        onChange(newValue)
    }

    return (
        <div
            ref={selectRef}
            className={clsx('select', isOpen && 'select--open', className)}
            onClick={() => {
                setIsOpen(true)
                inputRef?.current?.focus()
            }}
            onKeyDown={(e) => {
                if (e.code === 'Escape') {
                    setIsOpen(false)
                }
            }}
        >
            <div className="select__trigger">
                <input
                    type="text"
                    ref={inputRef}
                    tabIndex={0}
                    className="select__input"
                    value={isOpen ? searchTerm : displayedLabel}
                    placeholder={isOpen ? 'Search or add a tag' : placeholder}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter' && isSearchTermValid && searchTermIsUnique) {
                            handleTag(searchTerm)
                        }
                    }}
                    onFocus={() => {
                        setIsOpen(true)
                    }}
                />
                <ChevronDown width={20} height={20} className="select__chevron" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="select__dropdown"
                        style={{ maxHeight: maxHeight }}
                    >
                        {isSearchTermValid && searchTermIsUnique && (
                            <div
                                className="select__item"
                                tabIndex={0}
                                onClick={() => {
                                    handleTag(searchTerm)
                                }}
                                onKeyDown={(e) => {
                                    if (e.code === 'Enter') {
                                        handleTag(searchTerm)
                                    }
                                }}
                            >
                                <span>{searchTerm}</span>
                                <small className="select__hint">Press enter to add</small>
                            </div>
                        )}
                        {filteredItems.map((item) => {
                            const selected = selectedItems.includes(item)
                            return (
                                <div
                                    key={item.value}
                                    className={clsx(
                                        'select__item',
                                        selected && 'select__item--selected',
                                    )}
                                    tabIndex={0}
                                    onClick={() => handleItemClick(item)}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            handleItemClick(item)
                                        }
                                    }}
                                >
                                    <span>{item.label}</span>
                                    {selected && <CheckIcon width={20} height={20} />}
                                </div>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Select
