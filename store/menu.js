export const state = () => ({
  menu: {
    intern: {
      title: "Information",
      links: [
        {
          text: "Events",
          desc: "speeches given at <strong>webzurich</strong>",
          url: "/events?page=1",
          icon: "presentation-play"
        },
        {
          text: "Workshops",
          desc: "lessons learned at <strong>webzurich</strong>",
          url: "/workshops",
          icon: "certificate"
        },
        {
          text: "Speakers",
          desc: "people who <strong>care and share</strong>",
          url: "/speakers",
          icon: "microphone"
        },
        {
          text: "CoC",
          desc: "our rules of <strong>good behaviour</strong>",
          url: "/code-of-conduct",
          icon: "security-important"
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
});
