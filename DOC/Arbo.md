```
plugins/
└── simcraft
    ├── core
    │   ├── ActorsMainManagers.js
    │   ├── DataManager.js
    │   ├── DebugTool.js
    │   ├── InputExtension.js
    │   ├── JsExtension.js
    │   ├── SC_SystemLoader.js
    │   ├── componants
    │   │   ├── ActorMainManager.js
    │   │   ├── Bitmap_Composite.js
    │   │   └── Window_ScBase.js
    │   ├── configs
    │   │   ├── SC_CoreConfig.js
    │   │   └── varConfig.js
    │   └── patchs
    │       └── Utils_GlobalPatch.js
    └── modules
        ├── action
        │   ├── configs
        │   │   └── SC_CharacterActionConfig.js
        │   └── patchs
        │       ├── ActorAnimManager_ActionPatch.js
        │       ├── GamePlayer_JumpPatch.js
        │       ├── Game_Character_ActionPatch.js
        │       └── Game_Interpreter_ActionPatch.js
        ├── actionSequence
        │   ├── configs
        │   │   └── SC_ActionSequencesConfig.js
        │   └── patchs
        │       └── ActorAnimManager_ActionSequencePatch.js
        ├── actorEvent
        │   ├── componants
        │   │   └── Game_ActorEvent.js
        │   └── patchs
        │       ├── GameActorEvent_GameMapPatch.js
        │       └── SpritesetMap_GameActorEventPatch.js
        ├── anim
        │   ├── componants
        │   │   └── ActorAnimManager.js
        │   ├── configs
        │   │   └── SC_CharacterAnimConfig.js
        │   ├── managers
        │   │   └── ActorsAnimsManagers.js
        │   └── patchs
        │       ├── ActorAnimManager_ValidationPatch.js
        │       └── Scene_Map_AnimPatch.js
        ├── cinematic
        │   ├── configs
        │   │   └── SC_CinematicConfig.js
        │   ├── patches
        │   │   └── Scene_Boot_SplashPatch.js
        │   ├── scenes
        │   │   └── Scene_Cinematics.js
        │   ├── sprites
        │   │   ├── Sprite_CinematicBtn.js
        │   │   └── Sprite_CinematicLayer.js
        │   └── windows
        │       ├── Window_Story.js
        │       └── Window_TitleGameInfos.js
        ├── daylight
        │   ├── componants
        │   │   └── Game_DayLight.js
        │   └── patchs
        │       └── SceneMap_DaylightPatch.js
        ├── gameDate
        │   ├── componants
        │   │   ├── Game_Date.js
        │   │   └── Game_DateFormatter.js
        │   └── patchs
        │       └── SceneMap_GameDatePatch.js
        ├── graphics
        │   ├── GraphicsAdjust_MultiPatch.js
        │   ├── configs
        │   │   └── SC_GraphicsConfig.js
        │   └── managers
        │       └── GraphicsManager.js
        ├── health
        │   ├── componants
        │   │   └── ActorHealthManager.js
        │   ├── configs
        │   │   └── SC_HealthConfig.js
        │   ├── managers
        │   │   └── ActorsHealthManagers.js
        │   └── patchs
        │       └── SceneMap_HealthPatch.js
        ├── input
        │   ├── configs
        │   │   └── SC_InputConfig.js
        │   └── managers
        │       └── InputManager.js
        ├── pose
        │   ├── configs
        │   │   └── SC_CharacterPoseConfig.js
        │   └── patchs
        │       ├── Game_Actor_EquipmentPosePatch.js
        │       └── Game_Actor_PosePatch.js
        ├── shadow
        │   ├── configs
        │   │   └── SC_ShadowConfig.js
        │   ├── patchs
        │   │   └── Sprite_VisualCharacter_ShadowPatch.js
        │   └── sprites
        │       └── Sprite_CharacterShadow.js
        ├── touchInput
        │   ├── configs
        │   │   └── SC_TouchInputConfig.js
        │   └── managers
        │       └── TouchInputManager.js
        ├── trpg
        │   ├── componants
        │   │   └── Game_BattlerTRPG.js
        │   ├── managers
        │   │   └── TRPGBattleManager.js
        │   └── scenes
        │       └── Scene_TrpgMapBattle.js
        └── visual
            ├── configs
            │   └── SC_VisualConfig.js
            ├── managers
            │   └── CharacterVisualManager.js
            ├── patchs
            │   ├── Game_Actor_VisualPatch.js
            │   └── Spriteset_Map_VisualPatch.js
            └── sprites
                └── Sprite_VisualCharacter.js

```