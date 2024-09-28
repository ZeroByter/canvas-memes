import * as THREE from "/missile defense/three.module.min.js";

export default function missileGenerator(baseHeight = 4.25, baseSize = 0.3, coneHeight = 1, finCount = 4, finHeight = 1, finSize = 0.5, finBottomOffset = 0.3) {
  const missile = new THREE.Object3D()

  missile.add(new THREE.Mesh(
    new THREE.CylinderGeometry(baseSize, baseSize, baseHeight, 10),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  ))

  {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(baseSize, coneHeight, 20),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    cone.position.y = baseHeight / 2 + coneHeight / 2;
    missile.add(cone)
  }
  if (finCount > 0) {
    const triangle = new THREE.Shape();
    triangle.moveTo(0, 0);
    triangle.lineTo(finSize, 0);
    triangle.lineTo(finSize, finHeight);

    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    material.side = THREE.DoubleSide;

    for (let i = 0; i < finCount; i++) {
      const mesh = new THREE.Mesh(
        new THREE.ShapeGeometry(triangle),
        material
      );
      mesh.position.x = Math.sin(i / finCount * Math.PI * 2) * (baseSize + finSize);
      mesh.position.y = baseHeight / -2 + finBottomOffset;
      mesh.position.z = Math.cos(i / finCount * Math.PI * 2) * (baseSize + finSize);
      mesh.lookAt(new THREE.Vector3(0, mesh.position.y, 0))
      mesh.rotateY(THREE.MathUtils.degToRad(-90))

      missile.add(mesh)
    }
  }

  return missile
}