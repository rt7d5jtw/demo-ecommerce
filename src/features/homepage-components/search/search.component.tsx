import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import './search.css';
import { useDispatch, useSelector } from 'react-redux';
import { search } from '../../product/thunks';
import { useHistory } from 'react-router';
import { selectItems, selectSearch, selectSearchItems } from '../../product/selectors';
import { BsSearch } from 'react-icons/bs';
import { IProduct } from '../../product/productSlice';
import { GiShoppingBag } from 'react-icons/gi';

export const Search = (): JSX.Element => {
  const searchItems = useSelector(selectSearchItems);
  const searchKeyword = useSelector(selectSearch);
  const products = useSelector(selectItems);
  const [input, setInput] = useState({ search: '' });
  const [data, setData] = useState<null | IProduct[]>(null);
  const dispatch = useDispatch();
  const { push } = useHistory();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.search) {
      dispatch(search(input.search));
      if (searchItems !== null && searchKeyword !== null) return push('/search-result');
    }
  }

  data && data.length > 50 ? setData(data.slice(0, 50)) : null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const result = products.filter((elem) => {
      return elem.title.match(new RegExp(input.search.trim(), 'gi'));
    });
    console.log(data);
    setData(result);
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  };

  return (
    <form className='search' role='search' onSubmit={handleSubmit}>
      <div className='search__wrapper'>
        <div className='search__wrapper__left'>
          <input
            type='search'
            placeholder='Search..'
            name='search'
            value={input.search}
            id='searchInput'
            onChange={handleChange}
            aria-label='Write a keyword for search'
            maxLength={75}
          />
        </div>
        <div className='search__wrapper__right'>
          <button
            style={input.search.length > 0 ? { visibility: 'visible' } : {}}
            aria-label='Search'
            name='submit_search'
            type='submit'
            aria-disabled='true'
          >
            <BsSearch id='search-icon' />
          </button>
        </div>
      </div>
      <nav
        className='search__suggestions'
        style={input.search.length > 0 ? { height: '35.3rem' } : {}}
      >
        <section>
          <ol>
            {data && input.search.length > 0
              ? data.map((el: IProduct) => (
                  <li key={el.id}>
                    <img src={require(`../../../assets/${el.image}`)} />
                    <div className='search__suggestions__product-info'>
                      <h2>{el.title}</h2>
                      <h2>${el.price}</h2>
                    </div>
                    <button>
                      <GiShoppingBag />
                    </button>
                  </li>
                ))
              : null}
          </ol>
        </section>
      </nav>
    </form>
  );
};
