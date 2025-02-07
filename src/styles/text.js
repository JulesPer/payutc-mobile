/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { StyleSheet } from 'react-native';
import colors from './colors';
import { createStyleFromList } from './variables';

// Font colors
export const textColors = createStyleFromList(colors, 'color');

// Font Size
export const textSizes = StyleSheet.create({
	h0: { fontSize: 38 },
	h1: { fontSize: 32 },
	h2: { fontSize: 24 },
	h3: { fontSize: 20 },
	h4: { fontSize: 16 },
	h5: { fontSize: 12 },
	p: { fontSize: 10 },
});

// Text Alignment
export const textAlign = StyleSheet.create({
	center: { textAlign: 'center' },
	left: { textAlign: 'left' },
	right: { textAlign: 'right' },
	justify: { textAlign: 'justify' },
});

export default {
	...textColors,
	...textSizes,
	...textAlign,
};
