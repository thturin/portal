import { useState, useRef, useEffect } from "react";
import { createQuestion, createMaterial } from "../models/block";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";



function QuestionEditor({ q, onQuestionChange, onQuestionDelete }) {
    //onChange passed down from the parent so everything stays in sync
    const update = (field, value) => {
        //ONCHANGE CREATES A NEW QUESTION OBJECT WITH UQPDATED FIELD  VALUE
        onQuestionChange({ ...q, [field]: value }); //field is the placeholder for any property
        //properties of questionBlock blockType, type, prompt, desc
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['code-block'], // ✅ Add code block support
            ['clean']
        ]
    }
    //DISPLAY PROMPT TEXT BOX
    return (
        <div className="p-4 border rounded mb-4 bg-white shadow">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <ReactQuill
                        type="text"
                        placeholder="Prompt"
                        className="w-full border p-2 mb-2"
                        value={q.prompt}
                        rows={3}
                        onChange={(value) => update("prompt", value)}
                        theme="snow"   
                    />
                </div>

                {/*DISPLAY ANSWER KEY. If q has subquestions, don't render*/}
                {q.subQuestions.length === 0 && (
                    <div className="w-64">
                        <label className="block font-semibold mb-1">Answer Key</label>
                        <ReactQuill
                            placeholder="Admin Key"
                            className="w-full border mb-2"
                            value={q.key || ""}
                            onChange={value => update("key", value)}
                            modules={modules}
                            theme="snow"
                        />
                    </div>
                )}

            </div>

            {/* DISPLAY SUB QUESTIONS */}
            {q.subQuestions && q.subQuestions.length > 0 && (
                <div className="ml-4 border-l-2 pl-2">
                    {q.subQuestions.map((sq, i) => (
                        <QuestionEditor
                            key={sq.id}
                            q={sq}
                            onQuestionChange={
                                //pass the updated Sub Q from child to parent in
                                //updatedSubQ
                                updatedSubQ => {
                                    const updatedSubs = q.subQuestions.map((sub, idx) =>
                                        idx === i ? updatedSubQ : sub
                                    );
                                    // Call parent's onQuestionChange to update the parent question
                                    onQuestionChange({ ...q, subQuestions: updatedSubs });
                                }}
                            onQuestionDelete={() => {
                                //filter everything but the q to delete
                                const updatedSubs = q.subQuestions.filter((_, idx) => idx !== i);
                                onQuestionChange({ ...q, subQuestions: updatedSubs });
                            }}
                        />
                    ))}
                </div>
            )}

            <select
                className="border p-2"
                value={q.type}
                onChange={(e) => update("type", e.target.value)}
            >
                <option value="short">Short Answer</option>
                <option value="textarea">Paragraph</option>
                <option value="code">Code Response</option>
            </select>

            <button
                onClick={() => {
                    const nextIndex = (q.subQuestions?.length || 0);
                    const nextLetter = String.fromCharCode(97 + nextIndex); //97=a
                    const newSubQ = createQuestion();
                    newSubQ.prompt = `${nextLetter}.`;
                    const updatedSubs = [...(q.subQuestions || []), newSubQ];
                    onQuestionChange({ ...q, subQuestions: updatedSubs }); //send to parent updated  q's and subQuestions
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Add Sub Question
            </button>
            <button
                onClick={onQuestionDelete}
                className="bg-red-600 text-white px-2 py-1 rounded ml-2"
            >
                Delete
            </button>

        </div>
    );
}