require 'clockwork'
require "benchmark"
include Clockwork
ENV['TZ']='Asia/Tokyo'
logger = Logger.new($stdout)

every(1.days, 'github commit') do
    puts `cd ~/workspace/tickRecorder/executions_csv;node split.js`
    puts `cd ~/workspace/tickRecorder/executions_csv;git add .`
    puts `cd ~/workspace/tickRecorder/executions_csv;git commit -m 'clockwork'`
    puts `cd ~/workspace/tickRecorder/executions_csv;git push -u origin main`
end

=begin
/bitcoin/rbtc_arbitrage/lib/clock_record_ticks.rb
開始
gem install clockwork
gem install daemons
clockworkd -c capture_stream.rb --log start

停止
$ ps -x | grep clock
$ kill [プロセスID]
clockworkd -c clock_trade_bitmex.rb --log stop

clockworkd -c clock_trade_bitmex.rb --log restart


http://qiita.com/ogomr/items/27e9fc7af5b978b5ced6

tail -F clockworkd.clock_trade.output

=end
