import abc

from send_money_command import SendMoneyCommand

class SendMoneyUseCase:
    """
    send_moneyのinterface
    """
    @abc.abstractmethod
    def send_money(self, send_money_command: SendMoneyCommand) -> bool:
        raise NotImplementedError()