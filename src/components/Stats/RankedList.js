/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, Text, View } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';
import { _, Stats as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

export default class RankedList extends React.PureComponent {
	renderItem(item, rank, roundedBottom = false) {
		const { euro, countTintColor } = this.props;

		return (
			<BlockTemplate
				key={item.name}
				customBackground={rank % 2 === 0 ? colors.backgroundBlock : colors.backgroundBlockAlt}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				roundedBottom={roundedBottom}
			>
				<Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary }}>#{rank}</Text>
				<View style={{ flex: 1, flexWrap: 'wrap', alignItems: 'center', marginHorizontal: 5 }}>
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.secondary }}>
						{item.name}
					</Text>
				</View>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: countTintColor || colors.primary,
					}}
				>
					{euro ? floatToEuro(item.count / 100) : item.count}
				</Text>
			</BlockTemplate>
		);
	}

	render() {
		const { items, title, noBottomBorder, loading } = this.props;

		return (
			<FlatList
				data={items}
				keyExtractor={item => item.name.toString()}
				renderItem={({ item, index }) =>
					this.renderItem(item, index + 1, !noBottomBorder && index === items.length - 1)
				}
				ListEmptyComponent={() => (
					<BlockTemplate roundedBottom customBackground={colors.backgroundBlockAlt}>
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.disabled }}>
							{loading ? _('loading_text_replacement') : t('empty_list')}
						</Text>
					</BlockTemplate>
				)}
				ListHeaderComponent={() => (
					<BlockTemplate roundedTop>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>{title}</Text>
					</BlockTemplate>
				)}
			/>
		);
	}
}
