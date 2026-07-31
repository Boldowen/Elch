import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

const EARTH_TEXTURE = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

export default function WelcomeScreen({ navigation }) {
  const { selectRole } = useAuth();
  const { t } = useT();
  const { height } = useWindowDimensions();
  const globeSize = Math.min(286, Math.max(210, height * 0.34));
  const intro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, { toValue: 1, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [intro]);

  const pick = (role) => {
    selectRole(role);
    navigation.navigate('Auth', { mode: role === 'traveler' ? 'register' : 'login' });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View pointerEvents="none" style={styles.ambientTop} />
      <View pointerEvents="none" style={styles.ambientBottom} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}><Text style={styles.logoNeedle}>✦</Text></View>
          <Text style={styles.logoText}>Elch</Text>
        </View>

        <View style={styles.hero}>
          <Animated.View style={{ opacity: intro, transform: [{ scale: intro.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }}>
            <Globe size={globeSize} />
          </Animated.View>
          <Animated.View style={[styles.copy, { opacity: intro, transform: [{ translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <Text style={styles.title}>{t('welcome.title')}</Text>
            <Text style={styles.sub}>{t('welcome.sub')}</Text>
          </Animated.View>
        </View>

        <View style={styles.row}>
          <RoleCard icon="⌖" title={t('welcome.travel')} subtitle={t('welcome.travelSub')} accent onPress={() => pick('traveler')} />
          <RoleCard icon="⌁" title={t('welcome.guide')} subtitle={t('welcome.guideSub')} onPress={() => pick('guide')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Globe({ size }) {
  return (
    <View accessibilityRole="adjustable" accessibilityLabel="Interactive 3D globe. Drag to rotate." style={[styles.globeWrap, { width: size, height: size }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: globeHtml(EARTH_TEXTURE) }}
        style={styles.globeWebView}
        containerStyle={styles.globeWebContainer}
        androidLayerType="hardware"
        javaScriptEnabled
        scrollEnabled={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function globeHtml(textureUrl) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent;touch-action:none}canvas{display:block;width:100%;height:100%}</style></head><body><script src="https://unpkg.com/three@0.160.1/build/three.min.js"></script><script>
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.z=3.35;
  scene.add(new THREE.HemisphereLight(0xb9d7ff,0x04070c,1.45));
  const sun=new THREE.DirectionalLight(0xfff4df,3.2);sun.position.set(4,3,5);scene.add(sun);
  const rim=new THREE.DirectionalLight(0x337dff,1.6);rim.position.set(-4,0,-3);scene.add(rim);
  const globe=new THREE.Group();globe.rotation.x=-.12;globe.rotation.y=-1.12;scene.add(globe);
  const material=new THREE.MeshPhongMaterial({color:0x6683a2,specular:0x7899bd,shininess:20});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,96,96),material);globe.add(earth);
  new THREE.TextureLoader().load('${textureUrl}',t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();material.map=t;material.needsUpdate=true});
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.075,72,72),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 n;void main(){float i=pow(.72-dot(n,vec3(0.,0.,1.)),2.7);gl_FragColor=vec4(.16,.48,1.,1.)*i;}'}));scene.add(atmosphere);
  function pos(lat,lon,r){const p=(90-lat)*Math.PI/180,t=(lon+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t))}
  const marker=new THREE.Group();marker.position.copy(pos(46.8625,103.8467,1.035));const normal=marker.position.clone().normalize();
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.045,20,20),new THREE.MeshBasicMaterial({color:0xff5a3c}));dot.position.copy(normal.clone().multiplyScalar(.09));marker.add(dot);
  const haloMat=new THREE.MeshBasicMaterial({color:0xff7b5d,transparent:true,opacity:.55,side:THREE.DoubleSide});const halo=new THREE.Mesh(new THREE.RingGeometry(.052,.086,32),haloMat);halo.position.copy(normal.clone().multiplyScalar(.095));halo.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);marker.add(halo);globe.add(marker);
  let dragging=false,lastX=0,lastY=0,vx=0,vy=0;
  const down=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;vx=vy=0;renderer.domElement.setPointerCapture(e.pointerId)};
  const move=e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;vx=dx*.006;vy=dy*.006;globe.rotation.y+=vx;globe.rotation.x=Math.max(-1.1,Math.min(1.1,globe.rotation.x+vy))};
  const up=()=>dragging=false;renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
  const clock=new THREE.Clock();let elapsed=0;function animate(){requestAnimationFrame(animate);const d=Math.min(clock.getDelta(),.05);elapsed+=d;if(!dragging){globe.rotation.y+=vx+d*.11;globe.rotation.x=Math.max(-1.1,Math.min(1.1,globe.rotation.x+vy));vx*=.94;vy*=.94}const s=1+Math.sin(elapsed*3)*.16;halo.scale.setScalar(s);haloMat.opacity=.36+Math.sin(elapsed*3)*.16;renderer.render(scene,camera)}animate();
  </script></body></html>`;
}

function RoleCard({ icon, title, subtitle, accent, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.card, accent ? styles.cardAccent : styles.cardMuted, pressed && styles.cardPressed]}>
      <View style={[styles.cardIcon, accent ? styles.cardIconAccent : styles.cardIconMuted]}><Text style={styles.cardIconText}>{icon}</Text></View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardSub, accent && styles.cardSubAccent]}>{subtitle}</Text>
      <Text style={[styles.continueText, accent && styles.continueAccent]}>Continue  →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.introBackground },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 8, paddingBottom: spacing.xl },
  ambientTop: { position: 'absolute', width: 280, height: 280, borderRadius: 140, top: -170, right: -120, backgroundColor: 'rgba(35,93,160,0.12)' },
  ambientBottom: { position: 'absolute', width: 240, height: 240, borderRadius: 120, bottom: -150, left: -130, backgroundColor: 'rgba(255,90,60,0.08)' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 2 },
  logoIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.introAccent, alignItems: 'center', justifyContent: 'center', shadowColor: colors.introAccent, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  logoNeedle: { color: colors.white, fontSize: 20, lineHeight: 22 },
  logoText: { color: colors.introAccent, fontSize: 21, fontWeight: '700', letterSpacing: -0.5 },
  hero: { flex: 1, justifyContent: 'center', paddingVertical: 6 },
  globeWrap: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  globeWebContainer: { flex: 1, width: '100%', height: '100%', backgroundColor: 'transparent' },
  globeWebView: { flex: 1, width: '100%', height: '100%', backgroundColor: 'transparent' },
  copy: { marginTop: 2 },
  title: { maxWidth: 330, fontSize: 29, lineHeight: 34, fontWeight: '700', letterSpacing: -0.8, color: colors.white },
  sub: { maxWidth: 330, marginTop: 9, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.60)' },
  row: { flexDirection: 'row', gap: 12, marginTop: 20 },
  card: { flex: 1, minHeight: 190, borderRadius: radius.xl, padding: 17, alignItems: 'flex-start', overflow: 'hidden' },
  cardAccent: { backgroundColor: colors.introAccent },
  cardMuted: { backgroundColor: colors.introPanel, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  cardPressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  cardIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  cardIconAccent: { backgroundColor: 'rgba(255,255,255,0.20)' },
  cardIconMuted: { backgroundColor: 'rgba(255,255,255,0.09)' },
  cardIconText: { color: colors.white, fontSize: 25, fontWeight: '500' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.white, marginBottom: 7 },
  cardSub: { flex: 1, fontSize: 12, lineHeight: 17, color: 'rgba(255,255,255,0.55)' },
  cardSubAccent: { color: 'rgba(255,255,255,0.84)' },
  continueText: { marginTop: 9, fontSize: 12, fontWeight: '700', color: colors.introAccent },
  continueAccent: { color: colors.white },
});
