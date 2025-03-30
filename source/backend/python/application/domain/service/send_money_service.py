from application.port.ingress.send_money_command import SendMoneyCommand
from application.port.ingress.send_money_use_case import SendMoneyUseCase

class SendMoneyService(SendMoneyUseCase):
    def send_money(self, send_money_command: SendMoneyCommand) -> bool:
        # モデルの更新
        send_money_command.source_account.withdraw(send_money_command.money)
        send_money_command.target_account.deposit(send_money_command.money)

        # DBへの保存

        return True