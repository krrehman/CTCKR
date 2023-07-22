import renderer from 'react-test-renderer';
import WfeFRFlowEnableDisableMfaContainer from './WfeFRFlowEnableDisableMfaContainer';

describe(`WfeFRFlowEnableDisableMfaContainer`, () => {
  it(`should match snapshot when mfa is enabled`, () => {
    expect(renderer.create(<WfeFRFlowEnableDisableMfaContainer enabled={true} />).toJSON()).toMatchSnapshot();
  });

  it(`should match snapshot when mfa is disabled`, () => {
    expect(renderer.create(<WfeFRFlowEnableDisableMfaContainer enabled={false} />).toJSON()).toMatchSnapshot();
  });
});
