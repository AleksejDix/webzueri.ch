export const state = () => ({

  menu: {
    intern: {
      title: "Information",
      links: [
        {
          text: "Talks",
          desc: "Speeches given at <strong>web zurich</strong>",
          url: "/events/1"
        },
        {
          text: "Speakers",
          desc: "People who <strong>care and share</strong>",
          url: "/speakers"
        },
        {
          text: "Code of Conduct",
          desc: "Our rules of <strong>good behaviour</strong>",
          url: "/code-of-conduct"
        }
      ]
    },
    social: {
      title: "community",
      links: [
        {
          text: "Patreon",
          desc: "Support us with <strong>some money</strong>",
          url: "https://www.patreon.com/webzurich",
          color: "#f96854"
        },
        {
          text: "Slack",
          desc: "Get help from your <strong>local peers</strong>.",
          url: "https://webzuerich-invite.herokuapp.com/",
          color: "#79D4B6"
        },
        {
          text: "Twitter",
          desc: "Tell the world about <strong>web zurich</strong>",
          url: "https://twitter.com/webzuerich",
          color: "#1DA1F3"
        },
        {
          text: "Meetup",
          desc: "Join the group for <strong>latest updates</strong>",
          url: "https://www.meetup.com/Web-Zurich/",
          color: "#F7405F"
        }
      ]
    }
  }
})
