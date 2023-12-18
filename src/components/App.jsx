import React, { useState, useEffect, useCallback } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setImages([]);
    setHasMoreImages(true);
    setPage(1);
  };

  const fetchImages = useCallback(async () => {
    setIsLoading(true);

    try {
      const API_KEY = '40313621-9143b56d57bfc999f5bdb1732';
      const perPage = 12;
      const apiUrl = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      const { hits, totalHits } = data;

      setImages((prevImages) => [...prevImages, ...hits]);
      setHasMoreImages(page < Math.ceil(totalHits / perPage));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, page, setIsLoading]);

  useEffect(() => {
    if (!query) return;

    const fetchImagesFromEffect = async () => {
      try {
        await fetchImages();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchImagesFromEffect();
  }, [query, page, fetchImages]);

  const handleLoadMore = () => {
    if (!isLoading && hasMoreImages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const openModal = (largeURL) => {
    setLargeImageURL(largeURL);
    setShowModal(true);
  };

  const closeModal = () => {
    setLargeImageURL('');
    setShowModal(false);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={openModal} />
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}
      {images.length > 0 && hasMoreImages && !isLoading && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
      {showModal && (
        <Modal isOpen={true} largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
