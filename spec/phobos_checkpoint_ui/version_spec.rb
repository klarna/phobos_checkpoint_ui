require 'spec_helper'

RSpec.describe 'PhobosCheckpointUI::VERSION' do
  it 'has a version' do
    expect(PhobosCheckpointUI::VERSION).to_not be_nil
  end

  it 'the latest version is described in CHANGELOG' do
    rex = File.read('CHANGELOG.md').match(/^## (?<version>\d+\.\d+\.\d+)(?<pre>\.\w+)?/)
    version = rex['version']
    version += rex['pre'] if rex['pre'].present?
    expect(version).to eq(PhobosCheckpointUI::VERSION)
  end
end
