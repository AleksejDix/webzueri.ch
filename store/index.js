import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      menu: {
        intern: {
          title: 'Information',
          links: [
            {
              text: 'Talks',
              desc: 'Speeches given at <strong>web zurich</strong>',
              url: '/talks/1'
            },
            {
              text: "Code of Conduct",
              desc: 'Our rules of <strong>good behaviour</strong>',
              url: '/code-of-conduct'
            }
          ]
        },
        social: {
          title: 'community',
          links: [
            {
              text: 'Patreon',
              desc: 'Support us with <strong>some money</strong>',
              url: 'https://www.patreon.com/webzurich'
            },
            {
              text: 'Slack',
              desc: 'Get help from your <strong>local peers</strong>.',
              url: 'https://webzuerich-invite.herokuapp.com/'
            },
            {
              text: 'Twitter',
              desc: 'Tell the world about <strong>web zurich</strong>',
              url: 'https://twitter.com/webzuerich'
            },
            {
              text: 'Meetup',
              desc: 'Join the group for <strong>latest updates</strong>',
              url: 'https://www.meetup.com/Web-Zurich/'
            }
          ]
        }
      }
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    }
  })
}

export default createStore