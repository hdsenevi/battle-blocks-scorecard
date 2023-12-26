//
//  AddPlayersView.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 26/12/2023.
//

import SwiftUI
import SwiftData

struct AddPlayersView: View {
    @Environment(\.dismiss) var dismiss
    
    @Binding var players: [Player]
    
    @State private var name = ""
    @FocusState private var focused: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            Form {
                Section("Add a new player") {
                    TextField("New player name", text: $name)
                        .focused($focused)
                        .submitLabel(.return)
                }
                .onSubmit {
                    addNewPlayerOnSubmit()
                }
    
                Section("Select existing player(s)") {
                    List {
                        ForEach(players) { player in
                            Text(player.name)
                        }
                    }
                }
            }
        }
        .navigationTitle("Add Players to game")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done", action: doneAction)
            }
        }
    }
    
    func doneAction() {
        focused = false
//        dismiss()
    }
    
    func addNewPlayerOnSubmit() {
        
    }
}

#Preview {
    do {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: Game.self, configurations: config)
        return NavigationView {
            AddPlayersView(players: .constant([Player(name: "Shana"), Player(name: "Diya")]))
        }
        .modelContainer(container)
    } catch {
        fatalError("Failed to create model container.")
    }
}
