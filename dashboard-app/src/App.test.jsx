import App from './App';
import Enzyme, { shallow, render, mount } from "enzyme";

it('renders correctly', () => {
  const wrapper = shallow (
    <App />
  );
  expect(wrapper).toMatchSnapshot();
});
