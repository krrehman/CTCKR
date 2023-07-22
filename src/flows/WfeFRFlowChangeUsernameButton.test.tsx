import renderer from 'react-test-renderer';
import WfeFRFlowChangeUsernameButton from './WfeFRFlowChangeUsernameButton';

describe(`WfeFRFlowChangeUsernameButton`, () => {
  it(`render`, () => {
    expect(renderer.create(<WfeFRFlowChangeUsernameButton />).toJSON()).toMatchSnapshot();
  });
});
