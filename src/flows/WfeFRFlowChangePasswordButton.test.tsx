import renderer from 'react-test-renderer';
import WfeFRFlowChangePasswordButton from './WfeFRFlowChangePasswordButton';

describe(`WfeFRFlowChangePasswordButton`, () => {
  it(`render`, () => {
    expect(renderer.create(<WfeFRFlowChangePasswordButton />).toJSON()).toMatchSnapshot();
  });
});
