export let messagePopulateOptions = [
  {
    path: 'sender',
    model: 'User',
    select: 'avatar email fullName role',
    populate: {
      path: 'avatar',
      model: 'Avatar',
      select: 'url'
    }
  },
  {
    path: 'reactions.user',
    model: 'User',
    select: 'avatar email fullName role',
    populate: {
      path: 'avatar',
      model: 'Avatar',
      select: 'url'
    }
  },
  {
    path: 'repliesTo',
    model: 'Message',

  }
]

export let chatPopulateOptions = [
  {
    path: 'members',
    model: 'User',
    populate: {
      path: 'avatar',
      model: 'Avatar',
      select: 'url'
    },
    select: 'avatar email fullName role'
  }
]

export let userPopulationOptions = [
  {
    path: 'avatar',
    model: 'Avatar',
    select: 'email role fullName avatar url'
  }
]
