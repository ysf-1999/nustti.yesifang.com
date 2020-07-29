module.exports = {
	productionSourceMap: false,
	chainWebpack: config => {
		config.devServer
			.host('127.0.0.1')
			.port(8080)
			.disableHostCheck(true)
	}
}