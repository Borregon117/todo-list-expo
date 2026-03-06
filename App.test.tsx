import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

describe('App Test', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <View>
        <Text>To-Do List Funciona</Text>
      </View>
    );
    expect(getByText('To-Do List Funciona')).toBeTruthy();
  });
});