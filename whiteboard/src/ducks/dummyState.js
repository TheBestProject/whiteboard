export default dummyState = {
  loggedStatus: true,
  userInfo: {
    ID: 2,
    username: 'Billy',
    email: 'something@something.com',
    profilePic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg'
  },
  groups: [
    {
      ID: 4,
      name: 'Fun stuff'
    },
    {
      ID: 7,
      name: 'Boring stuff'
    }
  ],
  projects: [
    {
      ID: 3,
      name: 'Our first project',
      groupID: 4,
    },
    {
      ID: 5,
      name: 'Our second project',
      groupID: 4,
    },
    {
      ID: 9,
      name: 'Our lame project',
      groupID: 7,
    },
    {
      ID: 11,
      name: 'Our stupid project',
      groupID: 7,
    }
  ],
  boards: [
    {
      ID: 1,
      name: 'Super awesome board 1',
      groupID: 4,
      projectID: 3
    },
    {
      ID: 2,
      name: 'Super awesome board 2',
      groupID: 4,
      projectID: 3
    },
    {
      ID: 3,
      name: 'Super awesome board 3',
      groupID: 4,
      projectID: 5
    },
    {
      ID: 4,
      name: 'Super awesome board 4',
      groupID: 4,
      projectID: 5
    },
    {
      ID: 6,
      name: 'Super awesome board 5',
      groupID: 7,
      projectID: 9
    },
    {
      ID: 7,
      name: 'Super awesome board 6',
      groupID: 7,
      projectID: 9
    },
    {
      ID: 9,
      name: 'Super awesome board 7',
      groupID: 7,
      projectID: 11
    },
    {
      ID: 9,
      name: 'Super awesome board 8',
      groupID: 7,
      projectID: 11
    }
  ]
}
