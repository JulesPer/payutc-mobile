/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AmountForm from '../../components/Transfer/AmountForm';
import MessageForm from '../../components/Transfer/MessageForm';
import RecipientForm from '../../components/Transfer/RecipientForm';
import Submit from '../../components/Transfer/Submit';
import colors from '../../styles/colors';
import { PayUTC } from '../../redux/actions';
import { Transfer as t } from '../../utils/i18n';

const FORMAT = /^\d+(,\d{1,2})?$/;

class TransferScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.primary,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.state = {
			message: null,
			amount: null,
			recipient: null,
			suggestions: [],
		};

		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleAmountErrorChange = this.handleAmountErrorChange.bind(this);
		this.handleRecipientChange = this.handleRecipientChange.bind(this);
		this.handleRecipientSelected = this.handleRecipientSelected.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { suggestions, suggestionsFetching } = this.props;

		if (prevProps.suggestionsFetching && !suggestionsFetching) {
			switch (suggestions.length) {
				case 0:
					this.setState({ recipientError: t('recipient_not_found'), suggestions: [] });
					break;

				case 1:
					this.handleRecipientSelected(suggestions[0]);

				default:
					this.setState({ recipientError: null, suggestions });
					break;
			}
		}
	}

	handleMessageChange(text) {
		this.setState({ message: text });
	}

	isStringValid() {
		const { amount } = this.state;

		if (amount == null) {
			return false;
		}

		return amount.match(FORMAT) != null;
	}

	handleAmountChange(value) {
		this.setState({ amount: value, amountError: null });
	}

	handleAmountErrorChange(error) {
		this.setState({ amountError: error });
	}

	isButtonDisabled() {
		const { recipient, amountError } = this.state;

		return recipient == null || !this.isStringValid() || amountError != null;
	}

	handleRecipientChange(recipient) {
		const { dispatch } = this.props;

		if (recipient) {
			dispatch(PayUTC.getUserAutoComplete(recipient));
		} else {
			this.setState({ recipientError: null, suggestions: [] });
		}
	}

	handleRecipientSelected(recipient) {
		this.setState({ recipientError: null, recipient });
	}

	render() {
		const minAmount = 0.01;
		const { navigation, suggestionsFetching } = this.props;
		const { message, amount, recipientError, amountError, recipient, suggestions } = this.state;
		const credit = navigation.getParam('credit');

		return (
			<KeyboardAwareScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<RecipientForm
						error={recipientError}
						recipient={recipient}
						suggestions={suggestions}
						suggestionsFetching={suggestionsFetching}
						onChange={this.handleRecipientChange}
						onSelect={this.handleRecipientSelected}
					/>
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<AmountForm error={amountError} onChange={this.handleAmountChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<MessageForm onChange={this.handleMessageChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<Submit
						recipient={recipient}
						message={message}
						amount={amount}
						minAmount={minAmount}
						onAmountErrorChange={this.handleAmountErrorChange}
						disabled={this.isButtonDisabled()}
						credit={credit}
					/>
				</View>
			</KeyboardAwareScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const suggestions = payutc.getUserAutoComplete();

	return {
		suggestions: suggestions.getData([]),
		suggestionsFetching: suggestions.isFetching(),
	};
};

export default connect(mapStateToProps)(TransferScreen);
