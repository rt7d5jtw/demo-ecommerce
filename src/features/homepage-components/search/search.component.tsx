import * as React from 'react';
import { ChangeEvent, useState, useRef, useEffect } from 'react';
import './search.css';
import { useDispatch, useSelector } from 'react-redux';
import { search } from '../../product/thunks';
import { useHistory } from 'react-router';
import { selectItems, selectSearch, selectSearchItems } from '../../product/selectors';
import { BsSearch } from 'react-icons/bs';
import { IProduct } from '../../product/productSlice';
import { GiShoppingBag } from 'react-icons/gi';
import { addItem, productToCartItem } from '../../cart/cartSlice';
import { selectAccessToken } from '../../user/selectors';
import { addItemDB } from '../../cart/thunks';

interface ISearch {
  scrollEvent: boolean;
}

export const Search = ({ scrollEvent }: ISearch): JSX.Element => {
  const user = useSelector(selectAccessToken);
  const searchItems = useSelector(selectSearchItems);
  const searchKeyword = useSelector(selectSearch);
  const products = useSelector(selectItems);
  const [input, setInput] = useState({ search: '' });
  const [data, setData] = useState<null | IProduct[]>(null);
  const dispatch = useDispatch();
  const { push, replace } = useHistory();

  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.search) {
      dispatch(search(input.search));
      if (searchItems !== null && searchKeyword !== null) return push('/search-result');
    }
  }

  data && data.length > 50 ? setData(data.slice(0, 50)) : null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    data ? setOpen(true) : null;
    const result = products.filter((elem) => {
      return elem.title.match(new RegExp(input.search.trim(), 'gi'));
    });
    setData(result);
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  };

  function cartAddhandler(product: IProduct) {
    /* copying an object into new CartItem from the ProductCard */
    dispatch(addItem(productToCartItem(product)));
    if (user) {
      dispatch(addItemDB(product.id));
    }
  }

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        ref.current &&
        ref2.current &&
        !ref2.current.contains(event.target as Node) &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [ref]);

  return (
    <form
      style={scrollEvent ? { transform: 'translateY(-120%)' } : {}}
      className='search'
      role='search'
      onSubmit={handleSubmit}
    >
      <div className='search__wrapper'>
        <div className='search__wrapper__left'>
          <input
            ref={ref2}
            onClick={() => (data && input.search.length > 0 ? setOpen(true) : null)}
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
      <nav ref={ref} className='search__suggestions' style={isOpen ? { height: '35.3rem' } : {}}>
        <section>
          <ol>
            {isOpen
              ? data &&
                data.map((product: IProduct) => (
                  <li key={product.id}>
                    <img
                      onClick={() =>
                        location.pathname === '/'
                          ? push(`/products/${product.categories[0].cname}/${product.id}`)
                          : replace(`/products/${product.categories[0].cname}/${product.id}`)
                      }
                      src={require(`../../../assets/${product.image}`)}
                    />
                    <div
                      onClick={() =>
                        location.pathname === '/'
                          ? push(`/products/${product.categories[0].cname}/${product.id}`)
                          : replace(`/products/${product.categories[0].cname}/${product.id}`)
                      }
                      className='search__suggestions__product-info'
                    >
                      <h2>{product.title}</h2>
                      <h2>${product.price}</h2>
                    </div>
                    <button type='button' onClick={() => cartAddhandler(product)}>
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
