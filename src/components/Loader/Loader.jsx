import { Blocks } from 'react-loader-spinner';

const CustomLoader = () => {
  return <Blocks
  visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
/>
};

export default CustomLoader;
