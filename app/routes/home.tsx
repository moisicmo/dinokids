import Login from "./auth/login";

export const metadata = () => {
  return [
    {
        title: 'Dinokids - Home',
        description: 'Bienvenido a Dinokids, la plataforma educativa para niños.',
        keywords: 'Dinokids, educación, niños, plataforma educativa',
    },
    {
      property: 'og:title',
      content: 'Dinokids - Home',
    }
  ]
}
  

const home = () => {
  return (
    <Login/>
  )
}

export default home;