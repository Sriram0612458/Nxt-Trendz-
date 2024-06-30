import './index.css'
import {FaSearch} from 'react-icons/fa'

const FiltersGroup = props => {
  const {
    details,
    ratingsList,
    searchtext,
    catagorybutt,
    ratingbutt,
    activecatagoryId,
    activeratingId,
    clearFilter,
    enteredtext,
    mainFunction,
  } = props

  const searchingFunction = event => {
    searchtext(event.target.value)
  }

  const clearFilterButton = () => {
    clearFilter()
  }

  const ifkeyboardpressedDown = event => {
    if ((event.key = 'Enter')) {
      mainFunction()
    }
  }

  return (
    <div className="filters-group-container">
      <div className="searchbar-holder">
        <input
          type="search"
          placeholder="Search"
          className="search-bar"
          onChange={searchingFunction}
          value={enteredtext}
          onKeyDown={ifkeyboardpressedDown}
        />
        <FaSearch />
      </div>
      <h1 className="filter-heading">Category</h1>
      {
        <ul className="list-ele">
          {details.map(each => {
            return (
              <li className="category-item" key={each.categoryId}>
                <button
                  className={
                    activecatagoryId === each.categoryId
                      ? 'act cat-button'
                      : 'cat-button'
                  }
                  onClick={() => catagorybutt(each.categoryId)}
                >
                  <p>{each.name}</p>
                </button>
              </li>
            )
          })}
        </ul>
      }
      <h1 className="filter-heading">Rating</h1>
      <ul className="list-ele">
        {ratingsList.map(each => {
          return (
            <li className="category-item" key={each.ratingId}>
              <button
                className="cat-button"
                onClick={() => ratingbutt(each.ratingId)}
              >
                <div className="rating-holder ">
                  <img
                    src={each.imageUrl}
                    className="rating-image"
                    alt={`rating ${each.ratingId}`}
                  />
                  <p
                    className={`${
                      activeratingId === each.ratingId ? 'act' : ''
                    } up`}
                  >
                    & up
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      <button className="clear-btn" onClick={clearFilterButton}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
