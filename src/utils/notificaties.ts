export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('Deze browser ondersteunt geen notificaties');
    return;
  }

  if (Notification.permission === 'granted') {
    alert('Notificaties zijn al ingeschakeld');
    return;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      alert('Notificaties zijn ingeschakeld');
    } else {
      alert('Notificaties zijn geweigerd');
    }
  } else {
    alert('Notificaties zijn eerder geweigerd. Pas je browserinstellingen aan om notificaties toe te staan.');
  }
};

export const sendNotification = (titel: string, bericht: string) => {
  if (Notification.permission === 'granted') {
    new Notification(titel, {
      body: bericht,
      icon: '/logo192.png'
    });
  }
};
