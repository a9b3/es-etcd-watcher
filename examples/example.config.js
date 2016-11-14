export default {
  keys: [
    {
      key: 'foo',
      commands: [
        async ({ data, api }) => {
          console.log(`foo data`, data)
        },
      ],
    },
    {
      key: 'bar',
      commands: [
        async ({ data, api }) => {
          api.template({
            src: './test.tpl',
            dest: './test.rendered',
            data,
          })
        },
        'docker ps',
      ],
    },
  ],
}
