/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import TitleParams from '../../components/TitleParams';
import { PayUTC } from '../../redux/actions';
import StatsHorizontalScrollView from '../../components/Stats/StatsHorizontalScrollView';
import RankedList from '../../components/Stats/RankedList';
import { _, Stats as t } from '../../utils/i18n';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import {
	firstTransaction,
	mostGivenToPeople,
	mostPurchasedItems,
	mostReceivedFromPersons,
	mostSpentItems,
} from '../../utils/stats';

class StatsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		const ever = firstTransaction(props.history);

		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		this.state = {
			dates: [
				{ title: _('ever'), date: ever },
				{ title: _('month'), date: oneMonthAgo },
				{ title: _('week'), date: oneWeekAgo },
				{ title: _('yesterday'), date: yesterday },
			],
			selectedDate: 0,
		};
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { historyFetching, historyFetched, dispatch } = this.props;

		if (!historyFetching && !historyFetched) {
			dispatch(PayUTC.getHistory());
		}
	}

	render() {
		const { historyFetched, history } = this.props;
		const { dates, selectedDate } = this.state;

		const filteredHistory = history.filter(
			item => new Date(item.date) > new Date(dates[selectedDate].date)
		);

		return (
			<ScrollView
				style={{ backgroundColor: colors.backgroundLight }}
				refreshControl={
					<RefreshControl
						refreshing={!historyFetched}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			>
				<TitleParams
					title={t('title')}
					settingText={_('since_*', { since: dates[selectedDate].title.toLowerCase() })}
				>
					<TabsBlockTemplate
						roundedBottom
						text={_('show_since')}
						tintColor={colors.secondary}
						default={selectedDate}
						onChange={index => this.setState({ selectedDate: index })}
						style={{ marginHorizontal: 15, borderTopWidth: 0 }}
						tabs={dates}
					/>
				</TitleParams>
				<View style={{ height: 15 }} />
				<StatsHorizontalScrollView
					history={history}
					historyFetching={!historyFetched}
					since={{ text: '', date: dates[selectedDate].date }}
				/>
				<TabsBlockTemplate
					style={{ margin: 15 }}
					roundedTop
					roundedBottom
					tintColor={colors.primary}
					tabs={[
						{
							title: t('buy_ranking_title'),
							children: () => (
								<RankedList
									title={t('buy_ranking')}
									items={mostPurchasedItems(filteredHistory).splice(0, 10)}
									countTintColor={colors.less}
									loading={!historyFetched}
								/>
							),
						},
						{
							title: t('spend_ranking_title'),
							children: () => (
								<RankedList
									title={t('spend_ranking')}
									euro
									items={mostSpentItems(filteredHistory).splice(0, 10)}
									countTintColor={colors.less}
									loading={!historyFetched}
								/>
							),
						},
						{
							title: t('transfer_ranking_title'),
							children: () => (
								<View>
									<RankedList
										title={t('receive_ranking')}
										euro
										noBottomBorder
										items={mostReceivedFromPersons(filteredHistory).splice(0, 5)}
										countTintColor={colors.more}
										loading={!historyFetched}
									/>
									<View style={{ borderTopWidth: 1, borderTopColor: colors.backgroundLight }} />
									<RankedList
										title={t('give_ranking')}
										euro
										items={mostGivenToPeople(filteredHistory).splice(0, 5)}
										countTintColor={colors.lightBlue}
										loading={!historyFetched}
									/>
								</View>
							),
						},
					]}
				/>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const history = payutc.getHistory();

	return {
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
		historyFetched: history.isFetched(),
	};
};

export default connect(mapStateToProps)(StatsScreen);
