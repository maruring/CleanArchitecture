from application.port.ingress.send_money_command import SendMoneyCommand

class Validation:
    @staticmethod
    def send_money_command(input_params: SendMoneyCommand):
        if len(input_params.source_account.get_account_id()) > 0:
            return False
        if len(input_params.target_account.get_account_id()) > 0:
            return False
        if type(input_params.money.amount) is int and input_params.money.amount > 0:
            return  False

        return True