"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icon } from "@/components/ui/icon"
import { useState } from "react"
import { siteConfig } from "@/config/site"
import {
  Phone,
  Mail,
  Menu,
  Truck,
  Package,
  Box,
  Container,
  Droplet,
  Snowflake
} from "lucide-react"

const truckCategories = [
  {
    title: "Popular Vehicles",
    items: [
      {
        name: "Tractor Units",
        description: "Heavy-duty prime movers",
        href: "/inventory?category=tractor-unit",
        icon: Truck,
      },
      {
        name: "Box Trucks",
        description: "Enclosed cargo vehicles",
        href: "/inventory?category=box-truck",
        icon: Box,
      },
      {
        name: "Tippers",
        description: "Dump trucks and tippers",
        href: "/inventory?category=tipper",
        icon: Package,
      },
    ],
  },
  {
    title: "Specialized Vehicles",
    items: [
      {
        name: "Refrigerated",
        description: "Temperature controlled",
        href: "/inventory?category=refrigerated",
        icon: Snowflake,
      },
      {
        name: "Tankers",
        description: "Liquid transport",
        href: "/inventory?category=tanker",
        icon: Droplet,
      },
      {
        name: "Trailers",
        description: "All trailer types",
        href: "/inventory?category=trailer",
        icon: Container,
      },
    ],
  },
]

const topBrands = ["Mercedes-Benz", "Scania", "Volvo", "DAF", "MAN", "Iveco"]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full border-b bg-white shadow-lg">
      {/* Top Bar - Contact Info */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div className="container">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-8">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-red transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-red transition-colors font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline text-slate-600 font-medium">Export Desk Available</span>
              <span className="text-brand-green font-bold px-3 py-1 bg-green-50 rounded-full">Mon-Fri 8AM-6PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container">
        <div className="flex h-36 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-6 group -ml-2">
            <div className="relative h-28 w-28">
              <Image
                src="/melon-logo.png"
                alt="Auto Melon Group"
                width={112}
                height={112}
                className="h-28 w-28 object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="hidden lg:flex flex-col leading-tight">
              <span className="font-bold tracking-tight text-xl text-brand-ink group-hover:text-brand-red transition-colors">
                Auto Melon Group
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                Premium Commercial Vehicles
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Improved Spacing */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-3">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="group inline-flex h-11 w-max items-center justify-center rounded-lg px-6 py-2.5 text-base font-semibold transition-all hover:bg-brand-red/5 hover:text-brand-red focus:bg-brand-red/5 focus:text-brand-red focus:outline-none border-2 border-transparent hover:border-brand-red/20"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-11 px-6 py-2.5 text-base font-semibold rounded-lg border-2 border-transparent hover:border-brand-red/20 data-[state=open]:border-brand-red/20">Inventory</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[700px] p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {truckCategories.map((category) => (
                          <div key={category.title} className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {category.title}
                            </h4>
                            <div className="space-y-2">
                              {category.items.map((item) => (
                                <NavigationMenuLink asChild key={item.name}>
                                  <Link
                                    href={item.href}
                                    className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors group"
                                  >
                                    <div className="mt-0.5 rounded-md bg-brand-red-soft p-2 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                                      <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm mb-0.5">
                                        {item.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {item.description}
                                      </div>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t">
                        <Link
                          href="/inventory"
                          className="inline-flex items-center text-sm font-medium text-brand-red hover:text-brand-red-dark"
                        >
                          View All Inventory
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-11 px-6 py-2.5 text-base font-semibold rounded-lg border-2 border-transparent hover:border-brand-red/20 data-[state=open]:border-brand-red/20">Brands</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2">
                      {topBrands.map((brand) => (
                        <li key={brand}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/inventory?make=${brand}`}
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium">{brand}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/about"
                      className="group inline-flex h-11 w-max items-center justify-center rounded-lg px-6 py-2.5 text-base font-semibold transition-all hover:bg-brand-red/5 hover:text-brand-red focus:bg-brand-red/5 focus:text-brand-red focus:outline-none border-2 border-transparent hover:border-brand-red/20"
                    >
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/custom-order"
                      className="group inline-flex h-11 w-max items-center justify-center rounded-lg px-6 py-2.5 text-base font-semibold transition-all hover:bg-orange-600/10 hover:text-orange-600 focus:bg-orange-600/10 focus:text-orange-600 focus:outline-none border-2 border-transparent hover:border-orange-600/20"
                    >
                      Custom Order
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className="group inline-flex h-11 w-max items-center justify-center rounded-lg px-6 py-2.5 text-base font-semibold transition-all hover:bg-brand-red/5 hover:text-brand-red focus:bg-brand-red/5 focus:text-brand-red focus:outline-none border-2 border-transparent hover:border-brand-red/20"
                    >
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Contact Actions */}
          <div className="flex items-center gap-3">
            <Button
              size="default"
              variant="outline"
              className="hidden xl:flex border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-semibold shadow-md hover:shadow-lg transition-all"
              asChild
            >
              <a href={`tel:${siteConfig.contact.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call Us
              </a>
            </Button>
            <Button
              size="default"
              className="bg-gradient-to-r from-brand-red to-red-600 hover:from-brand-red-dark hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              asChild
            >
              <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                <Icon name="chat_bubble" className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link
                    href="/inventory"
                    className="flex items-center px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium">Inventory</span>
                  </Link>
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Top Brands
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {topBrands.map((brand) => (
                        <Link
                          key={brand}
                          href={`/inventory?make=${brand}`}
                          className="px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium">About</span>
                  </Link>
                  <Link
                    href="/custom-order"
                    className="flex items-center px-4 py-3 hover:bg-orange-50 rounded-lg transition-colors border-2 border-orange-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium text-orange-600">Custom Order</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium">Contact</span>
                  </Link>
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <Button
                      className="w-full justify-start bg-brand-green hover:bg-brand-green/90 text-white"
                      asChild
                    >
                      <a href={`tel:${siteConfig.contact.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {siteConfig.contact.phone}
                      </a>
                    </Button>
                    <Button
                      className="w-full justify-start bg-brand-red hover:bg-brand-red-dark text-white"
                      asChild
                    >
                      <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                        <Icon name="chat_bubble" className="mr-2 h-4 w-4" />
                        WhatsApp Us
                      </a>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
