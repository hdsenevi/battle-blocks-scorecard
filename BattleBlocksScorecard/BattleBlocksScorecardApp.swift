//
//  BattleBlocksScorecardApp.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 29/4/21.
//

import SwiftUI

@main
struct BattleBlocksScorecardApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
