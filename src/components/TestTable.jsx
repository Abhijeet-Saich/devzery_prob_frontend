import React, { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';

const TestTable = ({ searchQuery, filterType, filterValue }) => {
    const [testCases, setTestCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);

    useEffect(() => {
        fetchTestCases();
    }, []);

    useEffect(() => {
        filterTestCases();
    }, [searchQuery, testCases, filterType, filterValue]);

    const fetchTestCases = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/get_test_cases");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTestCases(data);
        } catch (error) {
            console.error("Failed to fetch test cases:", error);
        }
    };

    const filterTestCases = () => {
        let results = testCases;

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            results = results.filter(tc =>
                tc.description.toLowerCase().includes(lowercasedQuery) ||
                tc.module.toLowerCase().includes(lowercasedQuery) ||
                tc.priority.toLowerCase().includes(lowercasedQuery) ||
                tc.status.toLowerCase().includes(lowercasedQuery) ||
                tc.test_case_id.toString().includes(searchQuery)
            );
        }

        if (filterType && filterValue && filterType !== "All") {
            results = results.filter(tc => {
                const value = tc[filterType.toLowerCase()];
                return value.toLowerCase() === filterValue.toLowerCase();
            });
        }

        setFilteredCases(results);
    };

    const handleStatusChange = async (test_case_id, newStatus) => {
        try {
            if (newStatus === "null") return;
            const response = await fetch(`http://127.0.0.1:5000/update_test_case/${test_case_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                fetchTestCases(); // Re-fetch or optimistically update the local state
            } else {
                throw new Error("Failed to update the status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200 border-2">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-6 text-center text-xl font-bold tracking-wider">
                            Test Case Description
                        </th>
                        <th className="px-6 py-6 text-center text-xl font-bold tracking-wider">
                            Estimated Time
                        </th>
                        <th className="px-6 py-6 text-center text-xl font-bold tracking-wider">
                            Module
                        </th>
                        <th className="px-6 py-6 text-center text-xl font-bold tracking-wider">
                            Priority
                        </th>
                        <th className="px-6 py-6 text-center text-xl font-bold tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCases.map((testCase, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#a6b4ca] flex flex-col justify-end">
                                <p className="ml-1">ID no. {testCase.test_case_id}</p>
                                <p>
                                    <textarea
                                        readOnly
                                        value={testCase.description}
                                        rows="4"
                                        cols="50"
                                        className="p-2 border border-black-200 mt-2"
                                    />
                                </p>
                                <p>Last Edited: {formatDate(testCase.created_at)}</p>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-md text-[#a6b4ca]">
                                {testCase.estimated_time} minutes
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-md text-[#a6b4ca]">
                                {testCase.module}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-md text-[#a6b4ca]">
                                {testCase.priority}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                <select
                                    name=""
                                    id=""
                                    value={testCase.status}
                                    className="bg-[#00193c] text-[#627287] p-2 border rounded-lg text-lg"
                                    onChange={(e) =>
                                        handleStatusChange(testCase.test_case_id, e.target.value)
                                    }
                                >
                                    <option default value="null">
                                        Select
                                    </option>
                                    <option
                                        className="bg-[#916ed7] text-center p-1 text-gray-100"
                                        value="Pass"
                                    >
                                        Pass
                                    </option>
                                    <option
                                        className="bg-[#916ed7] text-center p-1 text-gray-100"
                                        value="Fail"
                                    >
                                        Fail
                                    </option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestTable;
