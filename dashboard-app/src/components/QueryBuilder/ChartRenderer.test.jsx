import ChartRenderer from '../ChartRenderer';
import Enzyme, { shallow, render, mount } from "enzyme";

it('renders correctly', () => {
  const wrapper = render (
    <ChartRenderer />
  );
  expect(wrapper).toMatchSnapshot();
});
