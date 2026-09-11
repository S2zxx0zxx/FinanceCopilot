export function setThemeBasedOnSystem(lightColor: string | null, darkColor: string | null, resolvedTheme?: string) {
  const root = document.documentElement
  const isDark = resolvedTheme === 'dark'

  const themeColor = isDark 
    ? darkColor
    : lightColor

  if (themeColor) {
    root.style.setProperty('--primary', themeColor)
    root.style.setProperty('--ring', themeColor)
    root.style.setProperty('--sidebar-primary', themeColor)

    const mixBase = isDark ? 'black' : 'white'
    const contrastBase = isDark ? 'white' : 'black'

    const accentBg = `color-mix(in srgb, ${themeColor}, ${mixBase} 90%)`
    const mutedBg = `color-mix(in srgb, ${themeColor}, ${mixBase} 94%)`
    root.style.setProperty('--accent', accentBg)
    root.style.setProperty('--sidebar-accent', accentBg)
    root.style.setProperty('--muted', mutedBg)

    const accentFg = `color-mix(in srgb, ${themeColor}, ${contrastBase} 20%)`
    root.style.setProperty('--accent-foreground', accentFg)
    root.style.setProperty('--sidebar-accent-foreground', accentFg)
  } else {
    root.style.removeProperty('--primary')
    root.style.removeProperty('--ring')
    root.style.removeProperty('--sidebar-primary')
    root.style.removeProperty('--accent')
    root.style.removeProperty('--accent-foreground')
    root.style.removeProperty('--muted')
    root.style.removeProperty('--sidebar-accent')
    root.style.removeProperty('--sidebar-accent-foreground')
  }
}