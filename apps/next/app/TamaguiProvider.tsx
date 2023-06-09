'use client'

import { Main } from 'next/document'
import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import { AppRegistry } from 'react-native'
import { TamaguiProvider as TamaguiProviderOG, createTamagui } from 'tamagui'

import { config as configBase } from '@tamagui/config'
import '@tamagui/core/reset.css'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import '@tamagui/polyfill-dev'

import Tamagui from '../tamagui.config'

const config = createTamagui({
  ...configBase,
  themeClassNameOnRoot: false,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useRootTheme()

  useServerInsertedHTML(() => {
    AppRegistry.registerComponent('Main', () => Main)

    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main')
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }} />
        {getStyleElement()}
      </>
    )
  })

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProviderOG config={config} themeClassNameOnRoot defaultTheme={theme}>
        {children}
      </TamaguiProviderOG>
    </NextThemeProvider>
  )
}
