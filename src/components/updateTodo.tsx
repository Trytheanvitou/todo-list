"use client"

import React, { useState } from 'react'
import { TodoType } from '../types/todoType'

interface updateTodoProp {
    onDelete: () => void,
    onComplete: () => void,
    onInComplete: () => void,
    onEdit: () => void,
    todo: TodoType
}

export const UpdateTodo: React.FC<updateTodoProp> = ({
    todo,
    onDelete,
    onComplete,
    onInComplete,
    onEdit
}) => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <>
            <div key={todo.id} className='flex justify-between items-center gap-5 w-full py-5 min-h-12.5 max-h-min' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                <span className={`ml-2 ${todo.isCompleted ? "line-through" : ""}`}>
                    {todo.todo}
                </span>

                {show && (
                    <div className=' flex items-center gap-5'>
                        <button className='bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded ml-10' onClick={() => onDelete()}>Remove</button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded mx-2"
                            onClick={() => onEdit()}
                        >
                            Edit
                        </button>
                        {todo.isCompleted ? (
                            <button className='bg-gray-500 hover:bg-gray-700 text-white py-1 px-4 rounded' onClick={() => onInComplete()}>Mark as Incomplete</button>
                        ) :
                            <button className='bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded' onClick={() => onComplete()}>Mark as Complete</button>
                        }
                    </div>
                )}
            </div>


        </>
    )
}
