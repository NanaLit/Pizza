import React, {useState, useEffect, useContext} from 'react';
import Categories from './../components/Categories/Categories.js';
import Sort from './../components/Sort/Sort.js';
import PizzaBlock from './../components/PizzaBlock/PizzaBlock.js';
import Skeleton from './../components/PizzaBlock/Skeleton.js';
import Pagination  from '../components/Pagination/Pagination.js';
import { SearchContext } from '../App.js';

function Home() {
    const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
    const [categoryId, setCategoryId] = useState(0)
    const [sortType, setSortType] = useState({
        name: "популярности",
        sortProperty: 'rating'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const onCangePage = (i) => {
        setCurrentPage(i)
    }
    const {searchValue} = useContext(SearchContext)
	useEffect(() => {
        setIsLoading(true)
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const sort = sortType.sortProperty.replace('-', '');
        const order = sortType.sortProperty.includes('-') ? 'desc' : 'asc';
        const search = searchValue ? `&search=${searchValue}` : '';
        const pagination = `page=${currentPage}`
		fetch(`https://65f82639b4f842e808870db2.mockapi.io/items?${pagination}&limit=4&${category}${search}&sortBy=${sort}&order=${order}`)
			.then(res => {
				return res.json()
			}).then(json => {setItems(json); setIsLoading(false)})
		window.scrollTo(0,0)
	}, [categoryId, sortType, searchValue, currentPage])
    const onClickCategory = (i) => {
        setCategoryId(i)
    }
	const onClickSort = (i) => {
        setSortType(i)
    }

    let pizzas = items
    // .filter(obj => {
    //     if(obj.name.toLowerCase().includes(searchValue.toLowerCase())) {
    //         return true;
    //     }
    //         return false
    // })
    .map((obj) => (<PizzaBlock key={obj.id} {...obj}/>));
    console.log(items)
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/> ) 
    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={(id) => onClickCategory(id)}/>
                <Sort value={sortType} onClickSort={(id) => onClickSort(id)}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {
                    isLoading ? skeletons : pizzas
                }
            </div>
            <Pagination onChangePage={(number) => onCangePage(number)} />
        </div>
    )
}
export default Home;