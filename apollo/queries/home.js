import gql from 'graphql-tag'

export const home = gql`
{
  events(orderBy: date_DESC) {
    id
    date
    title
    meetupLink
    talks {
      id
      name
      speakers {
        id
        name
        bio
        speakerPicture {
          url
          fileName
        }
      }
    }
    venue {
      id
      name
      where

    }
  }
}
`