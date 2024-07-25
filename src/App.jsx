import React,{Fragment,useState,useEffect} from 'react';


// importing other components
import TestTable from './components/TestTable';
import { MdOutlineSearch } from "react-icons/md";



const App = () => {

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterValue, setFilterValue] = useState('');

  // filter options
  const filterOptions = {
    Priority: ['High', 'Medium', 'Low'],
    Status: ['Pass', 'Fail', 'Idle'],
  };

  const handleSearch = () => {
    console.log('Searching for:', query);
  };


  return (
    <div className='max-w-6xl mx-auto'>

    {/* search bar */}
    <div className="flex items-center max-w-2xl mx-auto my-12 ">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Issue"
          className="w-full bg-[#002864] text-xl text-gray-100 pl-8 py-4 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-[#e64ba0] text-white rounded-[50%] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="search-button"
        >
          <MdOutlineSearch size={24}/>
        </button>
      </div>
    </div>

    {/* filter segment */}
    <div className='ml-6'>
      <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#002864] text-xl text-gray-100 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Filter </option>
            {Object.keys(filterOptions).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
      </div>
        {filterType !== 'All' && (
          <div>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="bg-[#002864] text-xl text-gray-100 px-4 py-2 rounded-xl border-gray-400  outline-none ring-2 focus:ring-blue-500"
            >
              <option value="">Select {filterType}</option>
              {filterOptions[filterType].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        )}
      </div>

    {/* Table segment */}
    <div className='text-red-600'>
        <TestTable  searchQuery={query} filterType={filterType} filterValue={filterValue}/>
    </div>
    </div>
  )
}

export default App