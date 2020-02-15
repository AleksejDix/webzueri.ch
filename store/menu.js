export const state = () => ({

  menu: {
    intern: {
      title: "Information",
      links: [
        {
          text: "Talks",
          desc: "speeches given at <strong>webzurich</strong>",
          url: "/events/1"
        },
        {
          text: "Workshops",
          desc: "lessons learned at <strong>webzurich</strong>",
          url: "/workshops"
        },
        {
          text: "Speakers",
          desc: "people who <strong>care and share</strong>",
          url: "/speakers"
        },
        {
          text: "CoC",
          desc: "our rules of <strong>good behaviour</strong>",
          url: "/code-of-conduct"
        }
      ]
    },
    social: {
      title: "community",
      links: [
        {
          text: "Talk",
          desc: "join our <strong>slack chat</strong>.",
          url: "https://webzuerich-invite.herokuapp.com/",
          color: "#79D4B6",
          icon: "slack"
        },
        {
          text: "Share",
          desc: "tweet about <strong>webzueri.ch</strong>",
          url: "https://twitter.com/webzuerich",
          color: "#1DA1F3",
          icon: "twitter"
        },
        {
          text: "Meet",
          desc: "subscribe at <strong>meetup.com</strong>",
          url: "https://www.meetup.com/Web-Zurich/",
          color: "#F7405F",
          icon: "meetup"
        }
      ]
    }
  }
})
