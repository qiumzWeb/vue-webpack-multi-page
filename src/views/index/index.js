import { Vue, Common } from 'js/base'
require('./scss/home.scss')
import homeIndex from './index.vue'
var homeVue = new Vue({
	el: '#home',
    template: '<div class="pageview">\
                    <home></home>\
                </div>',
	data: {},
	components: {
		'home': homeIndex
	}
})