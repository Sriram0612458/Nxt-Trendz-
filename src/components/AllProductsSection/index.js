import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchField: '',
    catagoryid: '',
    ratingid: '',
    errorMessage: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  searchStateUpdate = value => {
    this.setState({searchField: value})
  }

  catagoryStateUpdate = value => {
    this.setState({catagoryid: value}, this.getProducts)
  }

  ratingStateUpdate = value => {
    this.setState({ratingid: value}, this.getProducts)
  }

  clearFilter = () => {
    this.setState(
      {ratingid: '', searchField: '', catagoryid: ''},
      this.getProducts,
    )
  }

  mainFunction = () => {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {activeOptionId, searchField, catagoryid, ratingid} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${catagoryid}&title_search=${searchField}&rating=${ratingid}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.setState({errorMessage: true})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  successfulView = () => {}

  renderProductsList = () => {
    const {productsList, activeOptionId, errorMessage} = this.state
    const isEmpty = productsList.length === 0

    if (errorMessage) {
      return this.renderFailureView()
    }
    return (
      <>
        {isEmpty ? (
          <div>
            <div className="no-products-view">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
                className="no-products-img"
                alt="no products"
              />
              <h1 className="no-products-heading">No Products Found</h1>
              <p className="no-products-description">
                We could not find any products. Try other filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="all-products-container">
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )
  render() {
    const {isLoading, ratingid, catagoryid, searchField} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          details={categoryOptions}
          ratingsList={ratingsList}
          searchtext={this.searchStateUpdate}
          catagorybutt={this.catagoryStateUpdate}
          ratingbutt={this.ratingStateUpdate}
          activecatagoryId={catagoryid}
          activeratingId={ratingid}
          clearFilter={this.clearFilter}
          enteredtext={searchField}
          mainFunction={this.mainFunction}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
