'use client'

import { useEffect, useRef } from 'react'

import { GOLDBOX_URL, SLOT } from '@/app/shared/config'
import { useGoogleAdScriptLoadStatusValue } from '@/app/shared/hooks/useGoogleAdScriptLoadStatus'
import * as styles from '@/app/shared/components/GoogleAdsense/style.css'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

interface GoogleAdsenseProps {
  type: 'floating' | 'banner' | 'modal' | 'interstitial'
}

function getDefaultAdInfo(type: 'floating' | 'banner' | 'modal' | 'interstitial') {
  switch (type) {
    case 'interstitial':
      return { src: '/images/ad/coupang-interstitial.png', width: 600, height: 960 }
    case 'floating':
      return { src: '/images/ad/coupang-floating.png', width: 1125, height: 156 }
    case 'modal':
      return { src: '/images/ad/coupang-modal.png', width: 240, height: 220 }
    default:
      // banner
      return { src: '/images/ad/coupang-banner.png', width: 640, height: 300 }
  }
}

export default function GoogleAdsense({ type }: GoogleAdsenseProps) {
  const googleADScriptLoadStatus = useGoogleAdScriptLoadStatusValue()

  const googleAdElRef = useRef<HTMLModElement>(null)
  const defaultAdElRef = useRef<HTMLAnchorElement>(null)

  const { src: adImgSrc, width: adImgWidth, height: adImgHeight } = getDefaultAdInfo(type)

  useEffect(() => {
    switch (googleADScriptLoadStatus) {
      case 'resolved':
        if (typeof window.adsbygoogle === 'undefined' && defaultAdElRef.current) {
          defaultAdElRef.current!.style.display = 'block'
        } else {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        }
        break
      case 'rejected':
        defaultAdElRef.current!.style.display = 'block'
        break
      default:
        // pending
        return
    }
  }, [googleADScriptLoadStatus])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (googleAdElRef.current && defaultAdElRef.current) {
        if (googleAdElRef.current.dataset.adStatus === 'unfilled') {
          defaultAdElRef.current.style.display = 'block'
        } else {
          defaultAdElRef.current.style.display = 'none'
        }
      }
    })

    if (googleAdElRef.current) {
      observer.observe(googleAdElRef.current, {
        attributes: true,
        attributeFilter: ['data-ad-status']
      })
    }
  }, [])

  return (
    <div className={styles.area}>
      <span className={styles.adText}>AD</span>
      <ins
        className={`adsbygoogle ${styles.googleAd} googleads`}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
        ref={googleAdElRef}
        data-ad-client="ca-pub-4440358116924496"
        data-ad-slot={SLOT}
      />
      <a
        className={styles.goldboxArea}
        ref={defaultAdElRef}
        href={GOLDBOX_URL}
        target="_blank"
        referrerPolicy="unsafe-url"
      >
        <img
          className={`${styles.goldbox} ${type === 'floating' ? 'overwrap' : ''}`}
          loading="eager"
          src={adImgSrc}
          alt="광고 이미지"
          width={adImgWidth}
          height={adImgHeight}
        />
      </a>
    </div>
  )
}
