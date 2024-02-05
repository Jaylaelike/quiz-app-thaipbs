'use client';   
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { FC } from 'react'
interface ProvidersProps {
    children: React.ReactNode
}

const queryClient = new QueryClient();

const Providers: FC<ProvidersProps> = ({children}) =>{
  return (
   
       <QueryClientProvider client={queryClient}>
        {children}
       </QueryClientProvider>
   
  )
}

export default Providers
