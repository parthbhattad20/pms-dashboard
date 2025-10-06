import Login from "./components/Login";
import Register from "./components/Register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Auth() {
  return (
    <div className='flex h-screen'>
      <div className='w-1/2'>
        <img className='object-cover w-full h-full' src="https://images.unsplash.com/photo-1616133321649-d29ebc595799?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="placeholder 3d render image" />
      </div>
      <div className='w-1/2 grid place-content-center'>
        <Tabs defaultValue="signup" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className='font-messina-mono font-bold uppercase' value="signup">Sign Up</TabsTrigger>
            <TabsTrigger className='font-messina-mono font-bold uppercase' value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className='font-messina-mono uppercase font-bold text-2xl'>Sign Up</CardTitle>
                <CardDescription>
                  Create your Aura account to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Register/>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className='font-messina-mono uppercase font-bold text-2xl'>Login</CardTitle>
                <CardDescription>
                  Head toward your dashboard by entering your login credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Login/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Auth